// components/ui/Typography.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const H1 = ({ className, ...props }) => (
  <h1
    className={cn(
      "scroll-m-20 text-3xl font-extrabold tracking-tight text-balance",
      className
    )}
    {...props}
  />
);

export const H2 = ({ className, ...props }) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0",
      className
    )}
    {...props}
  />
);

export const P = ({ className, ...props }) => (
  <p
    className={cn(
      "text-muted-foreground text-md leading-7 [&:not(:first-child)]:mt-2",
      className
    )}
    {...props}
  />
);

export const List = ({ className, ...props }) => (
  <ul className={cn("my-4 ml-6 list-disc [&>li]:mt-2", className)}>
    {props.lists.map((li) => {
      return (
        <>
          <li>{li}</li>
        </>
      );
    })}
  </ul>
);

export const TypographyMuted = ({ className, ...props }) => (
  <p className={cn("text-muted-foreground text-sm", className)} {...props} />
);

export const Table = ({ className, ...props }) => (
  <div className="my-4 w-full overflow-y-auto">
    <table className="w-full">
      <thead>
        <tr className="m-0 border-t p-0">
          {props.headers.map((header) => {
            return (
              <>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  {header}
                </th>
              </>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {props.rowData.map((row) => {
          return (
            <>
              <tr className="m-0 border-t p-0">
                {row.map((data) => {
                  return (
                    <>
                      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                        {data}
                      </td>
                    </>
                  );
                })}
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const TypographyBlockquote = ({ className, ...props }) => (
  <blockquote
    className={cn(
      "mt-4 border-l-2 pl-4 italic text-muted-foreground",
      className
    )}
    {...props}
  ></blockquote>
);
