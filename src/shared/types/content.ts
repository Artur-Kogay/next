export type ContentPageStatus = 'draft' | 'published' | 'archived';

export type ContentPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  linkTicket: string;
  status: ContentPageStatus;
};
