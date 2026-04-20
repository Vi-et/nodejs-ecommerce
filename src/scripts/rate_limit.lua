local current_key = KEYS[1]
local previous_key = KEYS[2]

local limit = tonumber(ARGV[1])
local window_size = tonumber(ARGV[2])
local elapsed = tonumber(ARGV[3])

-- 1. Lấy dữ liệu và ép kiểu sang Number
local prev_count = tonumber(redis.call('GET', previous_key) or 0)
local curr_count = tonumber(redis.call('GET', current_key) or 0)

-- 2. Tính toán con số ước tính (Estimate)
local estimate = prev_count * (1 - (elapsed / window_size)) + curr_count

-- 3. Trường hợp vượt giới hạn
if estimate >= limit then
    return {
        0,
        curr_count,
        prev_count,
        tostring(estimate), -- Chuyển sang string để JS nhận không bị sai số
        0                   -- Remaining là 0
    }
end

-- 4. Trường hợp được phép qua
redis.call('INCR', current_key)
redis.call('EXPIRE', current_key, window_size * 2) -- GIA HẠN CHO KEY HIỆN TẠI

return {
    1,
    curr_count + 1,
    prev_count,
    tostring(estimate + 1),
    math.max(0, math.floor(limit - (estimate + 1))) -- Tính remaining thực tế sau khi INCR
}
