"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Staff } from "@prisma/client";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  GitBranch,
  Menu,
  MessageSquare,
  StepForwardIcon as Progress,
  Star,
  Users,
} from "lucide-react";

import { EventsWithRelation } from "@/types/prisma-relations";
import { formatDistanceToNow, formatTimestamp } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { EventEdit } from "./event-actions";

interface EventCardProps {
  currentUser: Staff;
  event: EventsWithRelation;
  setEventStateAction: Dispatch<SetStateAction<EventsWithRelation[]>>;
}

export default function EventCard({
  currentUser,
  setEventStateAction,
  event,
}: EventCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  let progress = 0;

  let contributors: any = [
    { name: "Emma" },
    { name: "John" },
    { name: "Lisa" },
    { name: "David" },
  ];

  let tasks = [
    { title: "Create a new design", completed: true },
    { title: "Update the documentation", completed: true },
    { title: "Fix the issue", completed: false },
    { title: "Push the changes", completed: false },
  ];

  return (
    <Card
      className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={toggleExpand}
    >
      <CardHeader className="space-y-1">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={
                progress === 100
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }
            >
              {progress === 100 ? "Completed" : "In Progress"}
            </Badge>
            <h3 className="text-2xl font-semibold">{event.name}</h3>
          </div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => {
                    toggleExpand();
                    setIsOpen(true);
                  }}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} className="h-2" />
          </div>

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>End {formatTimestamp(new Date(event.end))}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          <span>{0}</span>
                        </div>
                        <div className="flex items-center">
                          <GitBranch className="mr-1 h-4 w-4" />
                          <span>{0} issues</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center text-sm font-medium">
                        <Users className="mr-2 h-4 w-4" />
                        Contributors
                      </h4>
                      <div className="flex -space-x-2">
                        {contributors.map((contributor: any, index: number) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="border-2 border-white">
                                  <AvatarImage
                                    src={
                                      contributor.image ||
                                      `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                                    }
                                    alt={contributor.name}
                                  />
                                  <AvatarFallback>
                                    {contributor.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{contributor.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Tasks</h4>
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">{task.title}</span>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Release Event
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        <EventEdit
          event={event}
          setEventStateAction={setEventStateAction}
          isOpen={isOpen}
          setIsOpenAction={setIsOpen}
          onClick={() => toggleExpand()}
        />
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-between text-sm text-gray-600">
          <span>
            Last updated:
            {formatDistanceToNow(new Date(event.updatedAt), {
              addSuffix: true,
            })}
          </span>
          <span>{0} approved issues</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const springConfig = { stiffness: 300, damping: 30 };
  const animatedHeight = useSpring(0, springConfig);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return { isExpanded, toggleExpand, animatedHeight };
}
