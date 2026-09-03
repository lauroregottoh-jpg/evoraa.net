import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap tracking-wide transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Bordeaux profond Farata — CTA principal */
        default: "bg-[#A07070] text-[#F2EBE0] hover:bg-[#8B5C62] shadow-sm",
        /* Or Farata — CTA secondaire premium */
        gold: "bg-[#B8954A] text-[#A07070] hover:bg-[#C9A55A] shadow-sm font-bold",
        outline:
          "border-[#C9BBAF] bg-transparent text-[#A07070] hover:bg-[#F2EBE0] aria-expanded:bg-[#F2EBE0]",
        secondary:
          "bg-[#DDD0C4] text-[#A07070] hover:bg-[#CFC0B2] aria-expanded:bg-[#DDD0C4]",
        ghost:
          "hover:bg-[#DDD0C4] text-[#A07070] aria-expanded:bg-[#DDD0C4]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-[#B8954A] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 min-h-11 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 rounded-[10px] px-2 text-xs in-data-[slot=button-group]:rounded-[10px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-[12px] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-[12px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-[52px] min-h-[52px] gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs":
          "size-7 rounded-[10px] in-data-[slot=button-group]:rounded-[10px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[12px] in-data-[slot=button-group]:rounded-[12px]",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
