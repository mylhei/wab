/**
 * Created by leiyao on 16/4/12.
 */

Date.prototype.addYear = function () {
    this.setFullYear(this.getFullYear() + 1);
    return this;
};

Date.prototype.addMonth = function () {
    this.setMonth(this.getMonth() + 1);
    return this;
};

Date.prototype.addDay = function () {
    this.setDate(this.getDate() + 1);
};

Date.prototype.addHour = function () {
    this.setTime(this.getTime() + (60 * 60 * 1000));
    return this;
};

Date.prototype.addMinute = function () {
    this.setTime(this.getTime() + (60 * 1000));
    return this;
};

Date.prototype.addSecond = function () {
    this.setTime(this.getTime() + 1000);
    return this;
};

Date.addSecond = function (date, sec) {
    return new Date(date.getTime() + sec * 1000);
};

Date.addMinute = function (date, min) {
    return new Date(date.getTime() + min * 60 * 1000);
};