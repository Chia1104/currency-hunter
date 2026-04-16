"use client";

import { ViewTransition } from "react";

import { Button, Avatar } from "@heroui/react";
import { Link } from "@tanstack/react-router";

export const AppNotFound = () => {
  return (
    <ViewTransition>
      <div className="flex w-full flex-col items-center justify-center p-4 text-center">
        <Avatar className="mb-4 size-16">
          <Avatar.Image src="/assets/bot.png" />
          <Avatar.Fallback>Bot</Avatar.Fallback>
        </Avatar>
        <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
        <p className="mb-8 max-w-md text-gray-500">
          The page you are looking for does not exist
        </p>
        <div className="flex gap-4">
          <Button variant="outline" aria-label="Back to home">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </ViewTransition>
  );
};
