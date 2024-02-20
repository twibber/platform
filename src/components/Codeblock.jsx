import {Badge} from "@/components/ui/badge";

export default function CodeBlock({label, code, extraBadge}) {
	return (
		<div className={"flex flex-col w-full h-full bg-primary-foreground border rounded-md p-4 gap-4"}>
			<div className={"flex flex-row items-center justify-between"}>
				<Badge variant={"secondary"} className={"rounded font-mono font-light"}>{label}</Badge>
				{extraBadge}
			</div>
			<code className={"bg-popover text-popover-foreground border rounded-md p-4"}>
				<pre className={"text-xs"}>
					{code}
				</pre>
			</code>
		</div>
	)
}