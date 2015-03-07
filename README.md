# simple-datepicker
[![Circle CI](https://circleci.com/gh/mycolorway/simple-datepicker.png?style=badge)](https://circleci.com/gh/mycolorway/simple-datepicker)



一个基于 [Simple Module](https://github.com/mycolorway/simple-module) 的选择日期组件。


### 一、如何使用

**1. 下载并引用**

通过 `bower install` 下载依赖的第三方库，然后在页面中引入这些文件：

```html
<link rel="stylesheet" type="text/css" href="[style path]/datepicker.css" />

<script type="text/javascript" src="[script path]/jquery.min.js"></script>
<script type="text/javascript" src="[script path]/module.js"></script>
<script type="text/javascript" src="[script path]/moment.js"></script>
<script type="text/javascript" src="[script path]/datepicker.js"></script>
```

**2. 初始化配置**

我们需要在页面的脚本里初始化 simple-datepicker：

```javascript
simple.datepicker({
    el: null,                // * 必须
    inline: false,           // 初始化时是否显示日历组件
    disableBefore: null,     // 禁用向前切换月份的按钮，参数为日期
    disableAfter: null,      // 禁用向后切换月份的按钮，参数为日期
    format: "YYYY-MM-DD",    // 格式化选中的日期格式
    width: null,             // 日历组件宽度
    monthpicker: false         // 只选择月份
});
```

### 二、方法和事件

**1. 实例方法**

**setDate(date)**

设置选择对应日期，参数可以是和 format 配置项一致的 String 或 Moment 对象。

**destroy**

销毁对象。

**2. 事件**

**select**

触发条件：选择某日期。返回格式化后的日期和日期对应的
参数：选中日期的 Moment 对象

