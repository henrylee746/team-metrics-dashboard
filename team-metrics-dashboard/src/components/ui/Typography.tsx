// components/ui/Typography.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const H1 = ({ className, ...props }) => (
  <h1
    className={cn(
      "scroll-m-20 text-xl font-extrabold tracking-tight text-balance",
      className
    )}
    {...props}
  />
);

export const P = ({ className, ...props }) => (
  <p
    className={cn(
      "text-muted-foreground text-md leading-7 [&:not(:first-child)]:mt-6",
      className
    )}
    {...props}
  />
);

export const Table = ({ className, ...props }) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className="w-full">
      <thead>
        <tr className="even:bg-muted m-0 border-t p-0">
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
              <tr className="even:bg-muted m-0 border-t p-0">
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
