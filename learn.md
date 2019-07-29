#js-cookie
一个轻量级的处理cookie的js API
##创建：
//创建简单的cookie
Cookies.set('name', 'value');
//创建有效期为7天的cookie
Cookies.set('name', 'value', { expires: 7 });
//为当前页创建有效期7天的cookie
Cookies.set('name', 'value', { expires: 7, path: '' });
##取值：
Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined
//获取所有cookie
Cookies.get(); // => { name: 'value' }
##删除值
Cookies.remove('name');
//如果值设置了路径，那么不能用简单的delete方法删除值，需要在delete时指定路径
Cookies.set('name', 'value', { path: '' });
Cookies.remove('name'); // 删除失败
Cookies.remove('name', { path: '' }); // 删除成功
//注意，删除不存在的cookie不会报错也不会有返回
##命名空间
如果担心不小心修改掉Cookies中的数据，可以用noConflict方法定义一个新的cookie。
var Cookies2 = Cookies.noConflict();
Cookies2.set('name', 'value');
