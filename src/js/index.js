$(function() {
    init();
    getTasks();

    $("#btn-sub").on("click", start);
    $("#btn-truncate").on("click", truncate);
});

function init() {
    layui.use('element', function() {

    });
};

function start() {
    var startUrl = $("#startUrl").val();
    var total = $("#total").val();
    alert("提交成功！");
    $.ajax({
        url: "/api/start",
        type: "POST",
        dataType: "json",
        async: false,
        data: {
            "startUrl": startUrl,
            "total": total
        },
        success: function(data) {

        },
        error: function() {
            layui.use('layer', function() {
                var layer = layui.layer;
                layer.msg("提交失败！");
            });
        }
    });
};

function getTasks() {
    $.ajax({
        url: "/api/getTasks",
        type: "POST",
        dataType: "json",
        data: {
            "page": 1,
            "size": 100
        },
        success: function(data) {
            var tasks = data.data.tasks;
            var status = "";
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].status == 0) {
                    status = "新创建";
                } else if (tasks[i].status == 1) {
                    status = "爬取中......";
                } else if (tasks[i].status == 2) {
                    status = "爬取结束";
                } else if (tasks[i].status == 3) {
                    status = "计算中......";
                } else {
                    status = "计算完成";
                }

                $("#taskstable").append(`<tr>
                                <td>` + tasks[i].id + `</td>
                                <td>` + tasks[i].startUrl + `</td>
                                <td>` + tasks[i].hasHandled + `</td>
                                <td>` + tasks[i].totalUrl + `</td>
                                <td>` + status + `</td>
                                <td width="200"><button class="layui-btn" onclick="showDetail(` + tasks[i].id + `)">详情</button>
                                <button class="layui-btn layui-btn-danger" onclick="deleteTask(` + tasks[i].id + `)">删除</button></td>
                            </tr>`);
            }
        },
        error: function() {

        }
    });
};

function showDetail(tasksId) {
    layui.use('layer', function() {
        layer.config({
            title: "Task详情",
            area: ['50%', '40%']
        });
        layer.open({
            type: 1,
            content: $('#panel-detail') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    });
};

function deleteTask(taskId) {
    layui.use('layer', function() {
        layer.confirm('删除后无法恢复，确认删除?', {
            icon: 3,
            title: '友情提示',
            area: ""
        }, function(index) {
            $.ajax({
                url: "/api/deleteTask",
                type: "POST",
                dataType: "json",
                data: {
                    "taskId": taskId
                },
                success: function(data) {
                    layui.use('layer', function() {
                        layer.msg("删除成功！", {
                            icon: 1
                        }, function() {
                            location.reload();
                        });
                    });
                },
                error: function() {

                }
            });
            layer.close(index);
        });
    })
};

function truncate() {
    /*$.ajax({
       url: "/api/truncate",
        type: "POST",
        dataType: "json",
        success: function(data) {
            layui.use('layer', function() {
                var layer = layui.layer;

                layer.config({
                    skin: "demo-class"
                });

                layer.msg("清除成功！", {
                    icon: 1
                }, function() {
                    location.reload();
                });
            });
        },
        error: function() {
        
        }
    });*/
};