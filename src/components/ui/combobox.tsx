import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			"flex h-full w-full flex-col overflow-hidden rounded-md bg-background text-foreground",
			className,
		)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

interface CommandInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
	({ className, ...props }, ref) => (
		<div
			className="flex items-center border-b border-border px-3"
			cmdk-input=""
		>
			<input
				ref={ref}
				className={cn(
					"flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	),
);
CommandInput.displayName = "CommandInput";

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"max-h-[300px] overflow-y-auto overflow-x-hidden",
				className,
			)}
			{...props}
		/>
	),
);
CommandList.displayName = "CommandList";

interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
	(props, ref) => (
		<div ref={ref} className="py-6 text-center text-sm" {...props} />
	),
);
CommandEmpty.displayName = "CommandEmpty";

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("overflow-hidden p-1", className)}
			{...props}
		/>
	),
);
CommandGroup.displayName = "CommandGroup";

interface CommandItemProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	value?: string;
	onSelect?: (value: string) => void;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
	({ className, value, onSelect, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		/>
	),
);
CommandItem.displayName = "CommandItem";

interface ComboboxProps {
	value: string;
	onValueChange: (value: string) => void;
	items: Array<{ value: string; label: string }>;
	placeholder?: string;
	searchPlaceholder?: string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			value,
			onValueChange,
			items,
			placeholder = "Select item...",
			searchPlaceholder = "Search...",
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);
		const [searchValue, setSearchValue] = React.useState("");

		const filteredItems = items.filter((item) =>
			item.label.toLowerCase().includes(searchValue.toLowerCase()),
		);

		const selectedLabel = items.find((item) => item.value === value)?.label;

		return (
			<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
				<PopoverPrimitive.Trigger asChild>
					<Button
						ref={ref}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{selectedLabel || placeholder}
						<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverPrimitive.Trigger>
				<PopoverPrimitive.Content className="w-[200px] p-0" align="start">
					<Command>
						<CommandInput
							placeholder={searchPlaceholder}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
						<CommandList>
							{filteredItems.length === 0 ? (
								<CommandEmpty>No items found</CommandEmpty>
							) : (
								filteredItems.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={() => {
											onValueChange(item.value === value ? "" : item.value);
											setOpen(false);
											setSearchValue("");
										}}
										onClick={() => {
											onValueChange(item.value === value ? "" : item.value);
											setOpen(false);
											setSearchValue("");
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === item.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{item.label}
									</CommandItem>
								))
							)}
						</CommandList>
					</Command>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Root>
		);
	},
);
Combobox.displayName = "Combobox";

export {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	Combobox,
};
