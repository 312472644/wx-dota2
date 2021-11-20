/***
 * 通过标签和类名获取dom元素内容
 * @param tag dom标签
 * @param cls 样式名称
 * @param html dom内容
 */
const getTagByClassRegex = (tag: string, cls: string, html: string) => {
    var reg = new RegExp("<" + tag + "[^>]*class[\\s]?=[\\s]?['\"]" + cls + "[^'\"]*['\"][\\s\\S]*?<\/" + tag + ">", "g");
    return html.match(reg);
};

export { getTagByClassRegex }