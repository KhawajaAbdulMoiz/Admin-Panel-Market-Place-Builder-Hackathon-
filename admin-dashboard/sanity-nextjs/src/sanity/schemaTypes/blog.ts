export default {
    name: 'blog',
    type: 'document',
    title: 'Blog Post',
    fields: [
      {
        name: 'id',
        type: 'string',
        title: 'ID',
        description: 'Unique identifier for the blog post',
       
      },
      {
        name: 'title',
        type: 'string',
        title: 'Blog Title',
        description: 'Title of the blog post',
      },
      {
        name: 'author',
        type: 'string',
        title: 'Author',
        description: 'The name of the author of the blog post',
      },
      {
        name: 'publishDate',
        type: 'datetime',
        title: 'Publish Date',
        description: 'The date when the blog post was published',
      },
      {
        name: 'content',
        type: 'text',
        title: 'Content',
        description: 'Main content of the blog post',
      },
      {
        name: 'category',
        type: 'string',
        title: 'Category',
        description: 'Category of the blog post (e.g., Tech, Lifestyle, Food, etc.)',
      },
      {
        name: 'tags',
        type: 'array',
        title: 'Tags',
        of: [{ type: 'string' }],
        options: {
          layout: 'tags',
        },
        description: 'Tags related to the blog post (e.g., Programming, AI, Reviews)',
      },
      {
        name: 'image',
        type: 'image',
        title: 'Featured Image',
        options: {
          hotspot: true,
        },
        description: 'A featured image for the blog post',
      },
      {
        name: 'excerpt',
        type: 'text',
        title: 'Excerpt',
        description: 'A short excerpt or summary of the blog post',
      },
      {
        name: 'published',
        type: 'boolean',
        title: 'Published',
        description: 'Status of the blog post (whether it is published or in draft)',
      },
    ],
  };
  