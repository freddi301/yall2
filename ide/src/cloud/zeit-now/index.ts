import {
  LocalSingleThreadedCluster,
  KeyvaluexyzStore
} from "../../core/distributedExecution";
import "isomorphic-fetch";

class CloudLambdaFunction extends LocalSingleThreadedCluster<string> {
  public async remoteRun(termPointer: string) {
    const response = await fetch(
      `${this.path}?termKey=${encodeURIComponent(termPointer)}`
    );
    const result = await response.text();
    return result;
  }
  public path = "https://distributed-lambda-calculus.now.sh/run.js";
  // public path = "http://localhost:8080";
  public work = this.run;
}

const worker = new CloudLambdaFunction(new KeyvaluexyzStore());

import { parse } from "url";
import { IncomingMessage, ServerResponse } from "http";

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { query } = parse(req.url as string, true);
    const termKey: string = (query.termKey || "") as string;
    const result = await worker.work(termKey);
    res.end(result);
  } catch (error) {
    res.end(String(error));
  }
};
