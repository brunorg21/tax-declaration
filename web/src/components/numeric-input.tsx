import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type NumericInputProps = NumericFormatProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export const NumericInput = React.forwardRef<
  HTMLInputElement,
  NumericInputProps
>(({ className, ...props }, ref) => {
  return (
    <NumericFormat
      getInputRef={ref}
      {...props}
      className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
        className || ""
      }`}
    />
  );
});
