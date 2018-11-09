/**
 * Created by fsd on 2018/11/9.
 */
layui.use(['form','layer','jquery','table'],function () {
    var form = layui.form,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;
    //表格加载
    var searchEntity = {"page":1,"pageSize":10,"region":1000000000000};
    var tableIns = table.render({
        elem: '#user',
        url: 'http://localhost:8089/eep/user/list/area', //数据接口
        method:"post",
        contentType: 'application/json',
        headers: {token:window.localStorage.getItem("t_token")},
        where:searchEntity,
        parseData:function (res) {
            return {
                "code": res.code, //解析接口状态
                "msg": res.desc, //解析提示文本
                "count": res.attach.total, //解析数据长度
                "data": res.attach.list //解析数据列表
            }
        },
        response:{statusCode:"code.ok"},
        page: true, //开启分页
        cols: [[ //表头
            {field: 'id', title: '编号', sort: true, fixed: 'left'}
            ,{field: 'nickname', title: '昵称'}
            ,{field: 'uname', title: '手机', sort: true}
            ,{field: 'created', title: '注册时间'}
            ,{field: 'right', title: '操作',toolbar:'#barDemo'}
        ]],
        done:function (res, curr, count) {}//回调函数
    });

    //查询
    form.on('submit(search)',function (data) {
        searchEntity = {"page":1,"pageSize":10,"region":1000000000000};
        for(key in data.field){
            if(data.field[key]){
                searchEntity[key] = data.field[key];
            }
        }
        tableReload();
        return false;
    });
    //表格重新加载
    var tableReload = function () {
        tableIns.reload({
            where:searchEntity
        });
    };
    // var frameName = $(window.frameElement).attr('name');
    //监听工具条
    table.on('tool(user)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        if(layEvent === 'del'){ //删除
            parent.layer.confirm('真的删除行么?', function(index){
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if(layEvent === 'edit'){ //编辑
            parent.iframeObjName = $(window.frameElement).attr('name');
            var index = parent.layer.open({
                type: 2,
                title: "编辑用户",
                area: ["700px", "620px"],
                fixed: false, //不固定
                maxmin: true,
                content: "view/user/userEdit.html",
                success:function(layero,index){
                    var body = parent.layer.getChildFrame('body', index);
                    body.find("#id").val(data.id);
                    body.find("#uname").val(data.uname);
                    body.find("#password").val(data.password);
                    body.find("#nickname").val(data.nickname);
                    form.render();
                }
                // end: function () {
                //     location.reload();
                // }
            });
        }
    });
});




