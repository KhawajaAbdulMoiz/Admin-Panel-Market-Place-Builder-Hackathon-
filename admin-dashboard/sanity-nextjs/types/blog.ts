export interface Blog {
    id: string; 
    title: string;
    author: string; 
    publishDate: string; 
    content: string; 
    category: string;
    tags: string[]; 
    image: {
      asset: {
        _ref: string; 
        _type: string; 
      };
      alt?: string; 
    };
    excerpt: string; 
    published: boolean; 
  }
  