export interface Quote {
  id: string
  text: string
  author?: string
  category: 'wisdom' | 'inspiration' | 'mystery' | 'guidance'
}

export const quotes: Quote[] = [
  {
    id: '1',
    text: '当你凝视深渊时，深渊也在凝视着你。',
    author: '尼采',
    category: 'wisdom'
  },
  {
    id: '2',
    text: '未来属于那些相信梦想之美的人。',
    author: '埃莉诺·罗斯福',
    category: 'inspiration'
  },
  {
    id: '3',
    text: '真正的智慧在于知道自己一无所知。',
    author: '苏格拉底',
    category: 'wisdom'
  },
  {
    id: '4',
    text: '星辰指引着迷失者的方向，而内心的光芒照亮前行的道路。',
    category: 'mystery'
  },
  {
    id: '5',
    text: '每一次选择都是一扇门，通向不同的命运。',
    category: 'guidance'
  },
  {
    id: '6',
    text: '时间是最公正的法官，它会揭示一切真相。',
    category: 'wisdom'
  },
  {
    id: '7',
    text: '勇气不是没有恐惧，而是面对恐惧依然前行。',
    category: 'inspiration'
  },
  {
    id: '8',
    text: '月圆之夜，古老的秘密在风中低语。',
    category: 'mystery'
  },
  {
    id: '9',
    text: '当你迷茫时，倾听内心的声音，它知道答案。',
    category: 'guidance'
  },
  {
    id: '10',
    text: '生命如河流，永远向前，永不回头。',
    category: 'wisdom'
  },
  {
    id: '11',
    text: '相信自己的力量，你比想象中更强大。',
    category: 'inspiration'
  },
  {
    id: '12',
    text: '在黑暗中寻找光明的人，终将成为他人的明灯。',
    category: 'mystery'
  },
  {
    id: '13',
    text: '耐心是通往成功的钥匙，急躁只会关闭机会之门。',
    category: 'guidance'
  },
  {
    id: '14',
    text: '智者从愚者身上学到的，比愚者从智者身上学到的更多。',
    category: 'wisdom'
  },
  {
    id: '15',
    text: '梦想是心灵的翅膀，让灵魂自由翱翔。',
    category: 'inspiration'
  }
]

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}

export const getQuotesByCategory = (category: Quote['category']): Quote[] => {
  return quotes.filter(quote => quote.category === category)
}
