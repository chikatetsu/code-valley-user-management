import { Post } from "@domain/post/entities/post.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class PostRepository extends Repository<Post> {
}