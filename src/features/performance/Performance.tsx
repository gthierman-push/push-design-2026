import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisIcon,
  LockIcon,
  PencilIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import { UpgradeButton } from "@components/upgrade-dialog";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";

import { freeReviewLimit, reviews } from "./reviews";

export function Performance() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>

      {/* The cap is the only thing standing between the account and the rest
          of the module, so the prompt to lift it sits with the news of it. */}
      {/* Alert tops its icon and action out against a one-line title; this one
          runs to two, so both are centred against the pair. */}
      <Alert className="pr-32 *:[svg]:translate-y-0 *:[svg]:self-center">
        <LockIcon />
        <AlertTitle>
          {`You've reached your maximum of ${freeReviewLimit} free performance reviews`}
        </AlertTitle>
        <AlertDescription>
          Upgrade to run as many review cycles as your team needs.
        </AlertDescription>
        <AlertAction className="top-1/2 -translate-y-1/2">
          {/* Reviews ship inside the Employee Engagement module, so that is
              what the prompt has to sell. */}
          <UpgradeButton feature="Employee Engagement" />
        </AlertAction>
      </Alert>

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search" aria-label="Search reviews" />
        </InputGroup>
        <Button variant="outline">
          Filters
          <SlidersHorizontalIcon data-icon="inline-end" />
        </Button>
        <Button>New Review</Button>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="pl-4">Title</TableHead>
              <TableHead>Reviewer(s)</TableHead>
              <TableHead>Reviewee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="w-12 pr-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="pl-4">
                  <Button variant="link" size="sm" className="px-0">
                    {review.title}
                  </Button>
                </TableCell>
                <TableCell>{review.reviewers}</TableCell>
                <TableCell>{review.reviewee}</TableCell>
                <TableCell>
                  <Badge
                    variant={review.status === "Draft" ? "outline" : undefined}
                    className={
                      review.status === "Complete"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : undefined
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {review.deadline ?? (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${review.title}`}
                        />
                      }
                    >
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <PencilIcon />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* One page of stub rows, so the arrows have nowhere to go yet. */}
        <div className="text-muted-foreground flex flex-wrap items-center justify-end gap-x-6 gap-y-2 border-t px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page">Rows per page:</label>
            <NativeSelect id="rows-per-page" size="sm" defaultValue="10">
              <NativeSelectOption>10</NativeSelectOption>
              <NativeSelectOption>25</NativeSelectOption>
              <NativeSelectOption>50</NativeSelectOption>
            </NativeSelect>
          </div>
          <span>
            1-{reviews.length} of {reviews.length}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="First page"
            >
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Last page"
            >
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
