var progress = "2%"; //进度条
$(function() {
    init();
    /*getTasks();*/

    /*第一次读取最新通知*/
    setTimeout(function() {
            getTasks();
        },
        200);
    /*30轮询读取函数*/
    setInterval(function() {
            getTasks();
        },
        3000);

    $("#btn-sub").on("click", start);
    $("#btn-truncate").on("click", truncate);
});

function init() {
    layui.use('element', function() {
        var element = layui.element();

        element.progress('myProcess', progress)
    });
};

function start() {
    var startUrl = $("#startUrl").val();
    var total = $("#total").val();
    if (startUrl.length == 0 || total.length == 0 || (startUrl.indexOf("http://") == -1 && startUrl.indexOf("https://") == -1)) {
        layui.use('layer', function() {
            let layer = layui.layer;
            layer.msg("您的输入有误，请重新输入！", {
                icon: 2,
                area: "",
                time: 2000
            });
        });
    } else {
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

                $("#startUrl").val("");
                $("#total").val("");

                layui.use('layer', function() {
                    let layer = layui.layer;
                    layer.msg("提交成功！", {
                        icon: 6,
                        area: "",
                        time: 2000
                    }, function() {
                        getTasks();
                    });
                });
            },
            error: function() {
                layui.use('layer', function() {
                    let layer = layui.layer;
                    layer.msg("提交失败！", {
                        icon: 2,
                        time: 2000
                    });
                });
            }
        });
    }
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
            $("#taskstable").empty();
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
                                <td>${tasks[i].id}</td>
                                <td>${tasks[i].startUrl}</td>
                                <td>${tasks[i].hasHandled}</td>
                                <td>${tasks[i].totalUrl}</td>
                                <td>${status}</td>
                                <td width="250">
                                    <button class="layui-btn" onclick="showDetail(${tasks[i].id})">详情</button>
                                    <button class="layui-btn layui-btn-warm" onclick="showRank(${tasks[i].id},${tasks[i].status})">结果</button>
                                    <button class="layui-btn layui-btn-danger" onclick="deleteTask(${tasks[i].id},${tasks[i].status})">删除</button>
                                </td>
                            </tr>`);
            }
        },
        error: function() {
            layui.use('layer', function() {
                let layer = layui.layer;
                layer.msg("查询失败！", {
                    icon: 5,
                    time: 2000
                });
            });
        }
    });
};

function showDetail(taskId) {
    /*第一次读取最新通知*/
 
    flushDetail(taskId);
   
    /*30轮询读取函数*/
    var myInterval = setInterval(function() {
            flushDetail(taskId);
        },
        3000);

    layui.use('layer', function() {
        let layer = layui.layer;
        layer.config({
            title: "Task详情",
            area: ["625px", "510px"],
            cancel: function(index, layero){ 
              clearInterval(myInterval);
              return true; 
            }    
        });
        layer.open({
            type: 1,
            content: $('#panel-detail') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    });
};

function flushDetail(taskId) {
    $.ajax({
        url: "/api/getTask",
        type: "POST",
        dataType: "json",
        data: {
            "taskId": taskId
        },
        success: function(data) {
            var task = data.data.task;
            var status = "";
            var crawlEndTime = task.crawlEndTime;
            var exportTime = task.exportTime;
            var pageRankTime = task.pageRankTime;

            layui.element().progress('myProcess', (task.hasHandled/task.totalUrl)*100+'%');

            switch(task.status) {
                case 0:
                    status = "新创建";
                    break;
                case 1:
                    status = "爬取中......";
                    crawlEndTime = "尚未计算结束哦......";
                    exportTime = "尚未计算结束哦......";
                    pageRankTime = "尚未计算结束哦......";
                    break;
                case 2:
                    status = "爬取结束";
                    break;    
                case 3:
                    status = "计算中......";
                    pageRankTime = "尚未计算结束哦......";
                    break;
                case 4:
                    status = "计算完成";
                    break;
                default: 
                    status = "hello";
            }

            $("#taskId").text(task.id);
            $("#taskStartUrl").text(task.startUrl);
            $("#hasHandled").text(task.hasHandled);
            $("#totalUrl").text(task.totalUrl);
            $("#status").text(status);
            $("#createTime").text(task.createTime);
            $("#crawlStartTime").text(task.crawlStartTime);
            $("#crawlEndTime").text(crawlEndTime);
            $("#exportTime").text(exportTime);
            $("#pageRankTime").text(pageRankTime);
        },
        error: function() {
            layui.use('layer', function() {
                let layer = layui.layer;
                layer.msg("查询失败！", {
                    icon: 5,
                    time: 2000
                });
            });
        }
    });
}

function showRank(taskId, status) {
    $('#panel-rank #tasks-rank').empty();
    if (status == 4) {
        layui.use('layer', function() {
            let layer = layui.layer;
            layer.config({
                title: "Task排名结果",
                area: ["900px", "520px"]
            });
            layer.open({
                type: 1,
                content: $('#panel-rank') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
        });
        $.ajax({
            url: "/api/getResult",
            type: "POST",
            dataType: "json",
            data: {
                "taskId": taskId
            },
            success: function(data) {
                var result = data.data.result;
                for (let i = 0; i < result.length; i++) {
                    $('#panel-rank #tasks-rank').append(`<tr>
                                                     <td>${i+1}</td>
                                                     <td>${result[i].url}</td>
                                                     <td>${result[i].title}</td>
                                                     <td>${result[i].rank}</td>
                                                 </tr>`);
                }
            },
            error: function() {
                layui.use('layer', function() {
                    let layer = layui.layer;
                    layer.msg("查询失败！", {
                        icon: 5,
                        time: 2000
                    });
                });
            }
        });
    } else {
        layui.use('layer', function() {
            let layer = layui.layer;
            layer.msg("尚未计算结束，请耐心等待哦......", {
                icon: 6,
                area: "",
                time: 2000
            });
        });
    }
};


function deleteTask(taskId, status) {
    if (status == 1) {
        layui.use('layer', function() {
            let layer = layui.layer;
            layer.msg("正在爬取数据，无法删除，请耐心等待......", {
                icon: 5,
                area: '',
                time: 2000
            });
        });
    } else {
        layui.use('layer', function() {
            let layer = layui.layer;
            layer.confirm('删除后无法恢复，确认删除?', {
                icon: 3,
                title: '友情提示',
                area: ''
            }, function(index) {
                $.ajax({
                    url: "/api/deleteTask",
                    type: "POST",
                    dataType: "json",
                    data: {
                        "taskId": taskId
                    },
                    success: function(data) {
                        getTasks();
                        layui.use('layer', function() {
                            let layer = layui.layer;
                            layer.msg("删除成功！", {
                                icon: 1,
                                area: "",
                                time: 2000
                            });
                        });
                    },
                    error: function() {
                        layui.use('layer', function() {
                            let layer = layui.layer;
                            layer.msg("删除失败！", {
                                icon: 2,
                                time: 2000
                            });
                        });
                    }
                });
                layer.close(index);
            });
        })
    }
};

function truncate() {
    layui.use('layer', function() {
        let layer = layui.layer;
        layer.config({
            title: "请输入管理员密码",
            area: "",
            fixed: false
        });
        layer.prompt(function(value, index, elem) {
            if (value == "upshi") {
                layer.close(index);
                layui.use('layer', function() {
                    let layer = layui.layer;
                    layer.msg("密码正确，正在清除......", {
                        icon: 1
                    });
                });
                /*$.ajax({
                   url: "/api/truncate",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        layui.use('layer', function() {
                            let layer = layui.layer;
                            layer.msg("清除成功！", {
                                icon: 1
                            }, function() {
                                location.reload();
                            });
                        });
                    },
                    error: function() {
                        layui.use('layer', function() {
                            let layer = layui.layer;
                            layer.msg("清除失败！", {
                                icon: 2,
                                time: 2000
                            });
                        });
                    }
                });*/
            } else {
                layer.close(index);
                layui.use('layer', function() {
                    let layer = layui.layer;
                    layer.msg("您输入的密码有误！", {
                        icon: 2
                    });
                });
            }
        });
    })
};