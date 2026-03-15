import { GITHUB_REPO_URL } from "./constants";

type IssueTemplate = "bug_report.yml" | "feature_request.yml";

interface IssueParams {
  template: IssueTemplate;
  labels: string[];
  title?: string;
}

export function buildIssueUrl({ template, labels, title }: IssueParams): string {
  const params = new URLSearchParams();
  params.set("template", template);
  if (labels.length > 0) {
    params.set("labels", labels.join(","));
  }
  if (title) {
    params.set("title", title);
  }
  return `${GITHUB_REPO_URL}/issues/new?${params.toString()}`;
}
