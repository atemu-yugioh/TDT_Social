import { Request } from "express";
import { PostTDTQueryDTO } from "src/post/post.dto/post.query.dto";
import { MongoClient } from "typeorm";

export class Pagination {
  page: number;
  limit: number;

  constructor(page: number, limit: number) {
    this.page = page;
    this.limit = limit;
  }

  /**
   * The offset for this pagination object. The offset determines what index (0 index) to start retrieving results from.
   *
   * @return the offset
   */
  public getOffset(): number {
    if (this.page < 1) {
      return 0;
    } else {
      return (this.page - 1) * this.limit;
    }
  }
}

export interface queryString {
  page: number;
  limit: number;
}

export class APIfeatures {
  query: any;
  queryString: queryString;
  constructor(query: any, queryString: queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  public paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
