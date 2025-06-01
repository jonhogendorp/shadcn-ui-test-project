import { Bold } from "lucide-react";

// Update the import path below if the Toggle component is located elsewhere
import { Toggle } from "../../components/ui/toggle";

export function ToggleDemo() {
	return (
		<Toggle aria-label='Toggle italic'>
			<Bold className='h-4 w-4' />
		</Toggle>
	);
}
