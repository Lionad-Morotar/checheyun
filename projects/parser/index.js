const fs = require('fs')
const cheerio = require('cheerio')
const { parse } = require('himalaya')

function findNode(nodes, fn) {
    nodes = Array.isArray(nodes) ? nodes : [nodes]
    const is = nodes.find(x => fn(x))
    if (is) return is
    for (let node of nodes) {
        if (node) {
            const isChild = findNode(node.children || [], fn)
            if (isChild) return isChild
        }
    }
    return null
}

const htmlRaw = fs.readFileSync('./album.html', { encoding: 'utf8' })
/**
 * cheerio html方法中文被编码问题
 * @see https://www.zhangwenbing.com/blog/nodejs/Byl0x1T1Q
 */
const $ = cheerio.load(htmlRaw, { decodeEntities: false })

/* 去除无用元素 */
$('sup').remove()
$('big').remove()
$('ul').remove()
$('.mw-cite-backlink').remove()
$('.mw-editsection').remove()
$('.album-type').remove()
$('.toc').remove() 
$('.thumb').remove()
$('.navigation-not-searchable').remove()
$('*').each((i, x) => {
    const handle = $(x)
    if (/^display:\s*none;$/.test(handle.attr('style'))) {
        handle.remove()
    }
    if (handle.type === 'comment') {
        handle.remove()
    }
    handle.removeAttr('style')
})

const htmlContent = $('.mw-parser-output').html()
const nodes = parse(htmlContent)

/* 去除无用信息 */
!(function removeUnuseNodes(nodes) {
    let i = nodes.length
    while (i-- > 0) {
        const handle = nodes[i]
        // 去除评论
        if (handle.type === 'comment') {
            nodes.splice(i, 1)
        }
        // 去除空行
        if (!handle.children && handle.content && /^[\s|\n]+$/.test(handle.content)) {
            nodes.splice(i, 1)
        }
        // 处理子节点
        if (handle.children) {
            removeUnuseNodes(handle.children)
        }
    }
})(nodes)

// 根据 H2 分组
const h2Group = []
nodes.reduce((h, c) => {
    if (c.tagName === 'h2') {
        h.push([])
    }
    const handle = h2Group[h2Group.length - 1]
    handle.push(c)
    return h
}, h2Group)

// 提取信息
const tagKeyNameMap = {
    h2: '标题',
}
function exact(nodes) {
    function getText(node, trim = true, ret = '') {
        let res = ret
        if (node.content) {
            res += node.content
        } else {
            res += (node.children || []).reduce((h, c) => h + getText(c, trim), '')
        }
        return trim ? res.replace(/\s*$|^\s*|(\r?\n)/g, '') : res
    }
    function safeKey(key, json) {
        const sk = '描述'
        key = key || sk
        if (!json[sk]) json[sk] = ''
        return key
    }
    const json = {}
    nodes.map(node => {
        switch(node.tagName) {
            case 'table': {
                const tbody = findNode(node, x => x.tagName === 'tbody')
                const tNameTR = tbody.children.shift()
                const key = safeKey(getText(tNameTR), json)
                json[key] = {}
                tbody.children.map(x => {
                    const [name, value] = x.children
                    json[key][getText(name)] = getText(value)
                })
                break
            }
            default: {
                const key =  safeKey(tagKeyNameMap[node.tagName], json)
                if (json[key]) json[key] += getText(node)
                else json[key] = getText(node)
                break
            }
        }
    })
    return json
}

const blocks = []
const defaultBlockNames = ['概述', '说明', '封面角色']
h2Group.map(block => {
    const json = exact(block)
    defaultBlockNames.includes(json[tagKeyNameMap.h2]) && blocks.push(json)
})
blocks.sort((a, b) => 
    defaultBlockNames.findIndex(x => x === a[tagKeyNameMap.h2]) - 
    defaultBlockNames.findIndex(x => x === b[tagKeyNameMap.h2])
)

fs.writeFileSync('./result.txt', JSON.stringify(blocks, null, 2))