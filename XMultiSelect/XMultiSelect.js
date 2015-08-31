/**
* select的多选插件
* create by :xcl @20150707
* github:https://github.com/xucongli1989/XMultiSelect
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
            var _this = this;
            var ops = $.extend({}, options, defaults);
            var id = $(this).attr("id") || "";
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
            $panel.addClass("XMultiSelect_Box").css({"top":$(_this).css("height"),"width":$(_this).css("width")});
            $(_this).html("<option value=\"\" style=\"display: none;\"></option>").wrap("<div class='XMultiSelect'></div>");
            $(_this).parent().append($panel);

            //根据header的option返回对应body下的所有option（this为header的option）
            var _getGroupBodyOptionByHeader = function () {
                return $(this).closest(ops.GroupHeaderClass).next(ops.GroupBodyClass).find(ops.OptionClass);
            };
            //根据body的option返回对应header下的option（this为body的option）
            var _getGroupHeaderOptionByBody = function () {
                return $(this).closest(ops.GroupBodyClass).prev(ops.GroupHeaderClass).find(ops.OptionClass);
            };

            //select click事件
            $body.on("click",$(_this).selector,function (e) {
                if (!$panel.is(":visible")) {
                    $panel.show();
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

            //非弹出层 click时隐藏弹出层
            $body.on("click", function (e) {
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
                    arrKey.push(dicModels[i].Key);
                    arrVal.push(dicModels[i].Val);
                }
                $(_this).html("<option value=\"" + arrVal.join(",") + "\" style=\"display:none;\">" + arrKey.join(",") + "</option>");
            };

            //清除value
            var _clearVal = function () {
                $(_this).html("<option value=\"\" style=\"display:none;\"></option>");
                $groupOption.prop({"checked":false});
            };

            //获取value
            var _getVal = function () {
                return $(_this).val();
            };

            //单击option时给select设置值
            $body.on("click", $groupOption.selector, function () {
                _createVal();
            });

            //头部添加功能按钮（全选、全不选）
            $panel.prepend("<div><a href='javascript:void(0);' class='XMultiSelect-SelectAll'>全选</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='XMultiSelect-Reverse'>反选</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='XMultiSelect-SelectNone'>全不选</a></div>");
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