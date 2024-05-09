import { VerifyCallback } from "passport-google-oauth20";

export interface IGoogleService {
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void>;
}