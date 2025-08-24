import Protected from "@/src/components/auth/Protected";
import AddressesInner from "@/src/components/address/AddressInner";
import ProfileInner from "@/src/components/profile/ProfileInner";

export default function ProfilePage() {
  return (
    <Protected>
      <div className="w-full  flex mt-20 justify-center">
        <div className="flex justify-between w-[1300px]">
          <ProfileInner />
          <AddressesInner />
        </div>
      </div>
    </Protected>
  );
}
