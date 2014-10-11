simple-datepicker
=================

一个基于 [Simple Module](https://github.com/mycolorway/simple-module) 的选择日期组件。


### 一、如何使用

**1. 下载并引用**

通过 `bower install` 下载依赖的第三方库，然后在页面中引入这些文件：

```html
<link rel="stylesheet" type="text/css" href="[style path]/font-awesome.css" />
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
    showPrevNext: true,      // 是否显示切换月份的按钮
    disableBefore: null,     // 禁用向前切换月份的按钮，参数为日期
    disableAfter: null,      // 禁用向后切换月份的按钮，参数为日期
    format: "YYYY-MM-DD",    // 格式化选中的日期格式
    width: null,             // 日历组件宽度
    month: null              // 初始化时日历显示的月份
});
```

### 二、方法和事件

simple-datepicker： 初始化之后，datepicker 实例会暴露一些公共方法供调用：

```javascript
// 初始化 simple-datepicker：
var datepicker = simple.datepicker({
  el: $('#datepicker')
});

// 调用 update 方法根据 date 参数重新渲染日历
select.update(date);
```

**1. 公共方法**

**update(date)**

根据 date 参数重新渲染日历，参数为日期。

**setSelectedDate(date)**

根据 date 参数选择对应日期，如果参数为空则清空选择的日期。

**2. 事件**

**select**

触发条件：选择某日期。返回格式化后的日期和日期对应的

