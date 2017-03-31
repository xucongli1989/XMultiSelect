# XMultiSelect 简介
多选插件（单击input后，在弹出层出选择相应的选项）

# 属性 #
<table>
<tr>
<td>属性名</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>GroupHeaderClass</td>
<td>".xgroupheader"</td>
<td>列表分类的头class</td>
</tr>
<tr>
<td>GroupBodyClass</td>
<td>".xgroupbody"</td>
<td>列表分类的主体class</td>
</tr>
<tr>
<td>OptionClass</td>
<td>".xoption"</td>
<td>每一项的class</td>
</tr>
</table>

# 方法 #
<table>
<tr>
<td>方法名</td>
<td>类型</td>
<td>说明</td>
</tr>
<tr>
<td>$(ele).XMultiSelect.SetVal</td>
<td>function(dicModels)</td>
<td>
设置已选值，dicModels为数组，如：[{"Key":"","Val":""},{"Key":"","Val":""},{"Key":"","Val":""}]
</td>
</tr>
<tr>
<td>$(ele).XMultiSelect.GetVal</td>
<td>string</td>
<td>已选项，以逗号分隔，如："1001,1002"</td>
</tr>
<tr>
<td>$(ele).XMultiSelect.ClearVal</td>
<td></td>
<td>清空值</td>
</tr>
</table>

# 预览图

![](https://raw.githubusercontent.com/xucongli1989/XMultiSelect/master/XMultiSelect/img1.jpg)
