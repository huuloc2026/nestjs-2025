import { JwtPayload } from "src/auth/types/jwtPayload.type";


export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
