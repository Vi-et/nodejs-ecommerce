
// src/utils/discount-validator.builder.js
class ProductValidatorBuilder {
  constructor(product) {
    this.product = product;
    this.errors = [];
  }

  validateProductExists() {
    if (!this.product) {
      this.errors.push('Product not found');
    }
    return this;
  }

  validateProductBelongsToShop(shopId) {
    if (this.product.product_shop.toString() !== shopId) {
      this.errors.push('Product does not belong to this shop');
    }
    return this;
  }

  validateIsPublished() {
    if (!this.product.isPublished) {
      this.errors.push('Product is not published');
    }
    return this;
  }


  build() {
    // Return validation result
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      product: this.product
    };
  }
}


module.exports = {ProductValidatorBuilder};