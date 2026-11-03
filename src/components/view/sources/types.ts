export interface SourceItem {
  id: string;
  name: string;
}

//{"status":"ok","sources":[]}
export interface ApiSourceResponse {
  status: string;
  sources: SourceItem[];
}
