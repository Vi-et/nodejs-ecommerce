const {discount} = require('../models/discount.model');

// src/utils/discount-validator.builder.js
class DiscountValidatorBuilder {
  constructor(discount) {
    this.discount = discount;
    this.errors = [];
  }

  validateDiscountExists() {
    if (!this.discount) {
      this.errors.push('Discount not found');
    }
    return this;
  }

  validateActive() {
    if (!this.discount.isActive) {
      this.errors.push('Discount is inactive');
    }
    return this;
  }

  validateStartDate() {
    if (new Date() < new Date(this.discount.startDate)) {
      this.errors.push('Discount has not started yet');
    }
    return this;
  }

  validateEndDate() {
    if (new Date() > new Date(this.discount.endDate)) {
      this.errors.push('Discount has expired');
    }
    return this;
  }

  validateMaxUses() {
    if (this.discount.maxUses <= this.discount.usesCount) {
      this.errors.push('Discount has reached maximum uses');
    }
    return this;
  }

  validateUserUsage(userId) {
    if (!userId) return this;
    
    const userUsageCount = this.discount.usersUsed.filter(used => used.userId === userId).length;
    if (userUsageCount >= this.discount.maxUsesPerUser) {
      this.errors.push(`You've reached the limit of ${this.discount.maxUsesPerUser} uses for this discount`);
    }
    return this;
  }

  validateMinOrderValue(orderValue) {
    if (!orderValue) return this;
    
    if (orderValue < this.discount.minOrderValue) {
      this.errors.push(`Order value must be at least ${this.discount.minOrderValue}`);
    }
    return this;
  }

  build() {
    // Return validation result
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      discount: this.discount
    };
  }
}

class NewDiscountValidatorBuilder {
  constructor(discountData) {
    this.discountData = discountData;
    this.errors = [];
  }

  // Validate percentage value (0-100)
  validatePercentageValue() {
    if (this.discountData.type === 'percentage' && this.discountData.value) {
      if (this.discountData.value < 0 || this.discountData.value > 100) {
        this.errors.push('percentage value must be between 0 and 100');
      }
    }
    return this;
  }

  // Validate dates
  validateDates() {
    if (this.discountData.startDate && this.discountData.endDate) {
      const startDate = new Date(this.discountData.startDate);
      const endDate = new Date(this.discountData.endDate);
      
      if (isNaN(startDate.getTime())) {
        this.errors.push('startDate is invalid');
      }
      
      if (isNaN(endDate.getTime())) {
        this.errors.push('endDate is invalid');
      }
      
      if (startDate >= endDate) {
        this.errors.push('endDate must be after startDate');
      }

      if (startDate < new Date()) {
        this.errors.push('startDate must be in the future');
      }
      if (endDate < new Date()) {
        this.errors.push('endDate must be in the future');
      }
    }
    return this;
  }

  // Validate applies to
  validateAppliesTo() {
    if (this.discountData.appliesTo) {
      // If specific, must have product IDs
      if (this.discountData.appliesTo === 'specific' && 
          (!this.discountData.productIds || this.discountData.productIds.length === 0)) {
        this.errors.push('productIds are required when appliesTo is "specific"');
      }
    }
    return this;
  }

  async validateExisted(code, shopId) {
    if (!code || !shopId) return this;
    
    // Check if discount code already exists
    const foundDiscount = await discount.findOne({code: code, shopId: shopId}).lean().exec();
    if (foundDiscount && foundDiscount.isActive) {
      this.errors.push('Discount code already exists');
    }

    return this;

  }

  build() {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      discountData: this.discountData
    };
  }
}

module.exports = {DiscountValidatorBuilder, NewDiscountValidatorBuilder};