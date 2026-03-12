export type Submission = {
  id: string;
  formId: string;
  formName: string;
  data: any;
  metadata: any;
  createdAt: string;
};

declare global {
  var __submissions: Submission[];
}

if (!globalThis.__submissions) {
  globalThis.__submissions = [];
}

export const store = {
  getSubmissions: () => globalThis.__submissions,
  addSubmission: (sub: Submission) => {
    globalThis.__submissions.unshift(sub);
  }
};
