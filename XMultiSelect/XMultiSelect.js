/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XMultiSelect/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XMultiSelect
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2015 in Shenzhen. China
 ********************************************************************************************
 * select的多选插件 
 * 当前版本：1.0.1
 * 更新时间：2015-10-15
 */
; (function ($) {
    var defaults = {
        GroupHeaderClass: ".xgroupheader",
        GroupBodyClass: ".xgroupbody",
        OptionClass: ".xoption"
    };

    var DicModel = function (key, val) {
        this.Key = key;
        this.Val = val;
    };

    $.fn.extend({
        XMultiSelect: function (options) {
            var _this = this,$this=$(this);
            var ops = $.extend({}, options, defaults);
            var id = $this.attr("id") || "",name=$this.attr("name");
            
            var $hdThis=$("<input type='hidden' name='"+name+"' value=''/>");
            var $body = $("body");
            var $panel = $("[XMultiSelect-For='" + id + "']");
            var $groupOption = $panel.find(ops.OptionClass);
            var $groupHeader = $panel.find(ops.GroupHeaderClass);
            var $groupHeaderOption = $groupHeader.find(ops.OptionClass);
            var $groupBody = $panel.find(ops.GroupBodyClass);
            var $groupBodyOption = $groupBody.find(ops.OptionClass);
            $panel.hide();

            //初始化布局
            $groupHeader.addClass("XMultiSelect_Header");
            $panel.addClass("XMultiSelect_Box").css({"top":$this.outerHeight(true),"width":$this.outerWidth()});
            $this.removeAttr("name").prop({"readonly":true});
            $this.wrap("<div class='XMultiSelect'></div>").after($hdThis);
            $this.parent().append($panel);

            //根据header的option返回对应body下的所有option（this为header的option）
            var _getGroupBodyOptionByHeader = function () {
                return $(this).closest(ops.GroupHeaderClass).next(ops.GroupBodyClass).find(ops.OptionClass);
            };
            //根据body的option返回对应header下的option（this为body的option）
            var _getGroupHeaderOptionByBody = function () {
                return $(this).closest(ops.GroupBodyClass).prev(ops.GroupHeaderClass).find(ops.OptionClass);
            };

            //select click事件
            $body.on("click",$this.selector,function (e) {
                if (!$panel.is(":visible")) {
                    $panel.show("fast");
                    return false;
                }
            });

            //单击header时全选与全不选
            $body.on("click", $groupHeaderOption.selector, function () {
                var bodyops = _getGroupBodyOptionByHeader.call(this);
                if (bodyops) {
                    bodyops.prop({ "checked": this.checked });
                }
            });

            //单击body时，处理header是否需要勾选
            $body.on("click", $groupBodyOption.selector, function () {
                var headerops = _getGroupHeaderOptionByBody.call(this);
                if (headerops) {
                    var bodyops = _getGroupBodyOptionByHeader.call(headerops[0]);
                    if (bodyops) {
                        if (bodyops.filter(":checked").length == bodyops.length) {
                            headerops.prop({ "checked": true });
                        } else {
                            headerops.prop({ "checked": false });
                        }
                    }
                }
            });

            //刷新header选中状态
            var refreshHeaderOptionCheckedState=function(){
                $groupHeaderOption.each(function(){
                    var bodyops = _getGroupBodyOptionByHeader.call(this);
                    this.checked=(bodyops.length==bodyops.filter(":checked").length);
                });
            };

            //根据当前值，选中body中的选项
            var _setOptionCheckedStateByVal=function(){
                $groupBodyOption.prop({"checked":false});
                var vals=($hdThis.val() || "").split(',');
                if(vals && vals.length>0){
                    for(var i=0;i<vals.length;i++){
                        if(vals[i] !=""){
                            $groupBodyOption.filter("[value='"+vals[i]+"']").prop({"checked":true});
                        }
                    }
                }
                refreshHeaderOptionCheckedState();
            };

            //非弹出层 click时隐藏弹出层
            $(document).on("click", function (e) {
                if ($panel.is(":visible")) {
                    var $et = $(e.target), flag = true;
                    if ($et[0] === $panel[0]) {
                        flag = false;//单击的对象就是panel
                    } else if ($et.closest("[XMultiSelect-For='" + id + "']")[0] === $panel[0]) {
                        flag = false;//单击的对象的所属容器是panel
                    }
                    if (flag) {
                        $panel.hide();
                        return false;
                    }
                }
            });

            //创建value
            var _createVal = function () {
                var dicLst = [];
                $groupBodyOption.filter(":checked").each(function () {
                    dicLst.push(new DicModel($(this).closest("label").text(), this.value));
                });
                _setVal(dicLst);
            };

            //设置value
            var _setVal = function (dicModels) {
                if (!dicModels || dicModels.length == 0) {
                    _clearVal();
                    return false;
                }
                var arrKey = [], arrVal = [];
                for (var i = 0; i < dicModels.length; i++) {
                    arrKey.push($.trim(dicModels[i].Key));
                    arrVal.push(dicModels[i].Val);
                }
                $this.val(arrKey.join(","));
                $hdThis.val(arrVal.join(","));
                _setOptionCheckedStateByVal();
            };

            //清除value
            var _clearVal = function () {
                $this.val("");
                $hdThis.val("");
                $groupOption.prop({"checked":false});
            };

            //获取value
            var _getVal = function () {
                return $hdThis.val();
            };

            //单击option时给select设置值
            $body.on("click", $groupOption.selector, function () {
                _createVal();
            });

            //头部添加功能按钮（全选、全不选）
            $panel.prepend("<div class='XMultiSelect-Bar'><a href='javascript:void(0);' class='XMultiSelect-SelectAll'>全选</a><a href='javascript:void(0);' class='XMultiSelect-Reverse'>反选</a><a href='javascript:void(0);' class='XMultiSelect-SelectNone'>全不选</a></div>");
            $panel.on("click",".XMultiSelect-SelectAll",function(){
                $groupOption.prop({"checked":true});
                _createVal();
                return false;
            });
            $panel.on("click",".XMultiSelect-Reverse",function(){
                $groupOption.each(function(){
                    this.checked=(!this.checked);
                });
                refreshHeaderOptionCheckedState();
                _createVal();
                return false;
            });
            $panel.on("click",".XMultiSelect-SelectNone",function(){
                $groupOption.prop({"checked":false});
                _createVal();
                return false;
            });

            //公开方法
            return {
                //设置值
                SetVal: function (dicModels) {
                    _setVal(dicModels);
                },
                //获取值
                GetVal: function () {
                    return _getVal();
                },
                //清除值
                ClearVal: function () {
                    _clearVal();
                }
            };
        }
    });
})(jQuery);