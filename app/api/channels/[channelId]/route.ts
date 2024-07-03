import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        // Check if the user has permission
        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
        });

        if (!server) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Perform the delete operation
        await db.channel.deleteMany({
            where: {
                id: params.channelId,
                serverId: serverId,
                name: {
                    not: "general",
                },
            },
        });

        return new NextResponse("Channel deleted", { status: 200 });

    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        // Check if the user has permission
        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
        });

        if (!server) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Perform the update operation
        await db.channel.updateMany({
            where: {
                id: params.channelId,
                NOT: {
                    name: "general",
                },
            },
            data: {
                name,
                type,
            }
        });

        return new NextResponse("Channel edited", { status: 200 });

    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
