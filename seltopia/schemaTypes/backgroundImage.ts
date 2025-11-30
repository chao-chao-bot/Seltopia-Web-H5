import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'backgroundImage',
  title: 'Background Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '图片标题，例如：禅宗-1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      description: '主题分类',
      options: {
        list: [
          {title: '禅宗', value: '禅宗'},
          {title: '智慧', value: '智慧'},
          {title: '儒家', value: '儒家'},
          {title: '箴言', value: '箴言'},
          {title: '赋能', value: '赋能'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageNumber',
      title: 'Image Number',
      type: 'number',
      description: '图片在该主题中的编号',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: '背景图片',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: '用于查询的唯一标识',
      options: {
        source: (doc: any) => `${doc.theme}-${doc.imageNumber}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      theme: 'theme',
      imageNumber: 'imageNumber',
      media: 'image',
    },
    prepare(selection) {
      const {title, theme, imageNumber, media} = selection
      return {
        title: title || `${theme} - ${imageNumber}`,
        subtitle: `主题: ${theme} | 编号: ${imageNumber}`,
        media: media,
      }
    },
  },
})



