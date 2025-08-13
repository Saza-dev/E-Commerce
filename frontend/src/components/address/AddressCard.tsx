import Card from "@/src/components/ui/card";
import Button from "@/src/components/ui/button";
import type { Address } from "@/src/lib/api/addresses";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onMakeDefault,
  readOnly = false,
}: {
  address: Address;
  onEdit?: (a: Address) => void;
  onDelete?: (a: Address) => void;
  onMakeDefault?: (a: Address) => void;
  readOnly?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {address.type}
            </span>
            {address.isDefault && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                Default
              </span>
            )}
          </div>
          <div className="mt-1 font-medium">{address.line1}</div>
          {address.line2 && (
            <div className="text-gray-700">{address.line2}</div>
          )}
          <div className="text-gray-700">
            {address.city}
            {address.state ? `, ${address.state}` : ""}
            {address.postalCode ? ` ${address.postalCode}` : ""}
          </div>
          <div className="text-gray-700">{address.country}</div>
          {address.phone && (
            <div className="text-gray-700 mt-1">{address.phone}</div>
          )}
        </div>

        {!readOnly && (
          <div className="flex flex-col gap-2">
            {onEdit && (
              <Button
                className="!px-3"
                variant="ghost"
                onClick={() => onEdit(address)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                className="!px-3"
                variant="ghost"
                onClick={() => onDelete(address)}
              >
                Delete
              </Button>
            )}
            {!address.isDefault && onMakeDefault && (
              <Button className="!px-3" onClick={() => onMakeDefault(address)}>
                Make default
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
