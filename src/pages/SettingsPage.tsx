import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [couponAlerts, setCouponAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(false);

  const toggles = [
    { label: 'การแจ้งเตือนทางอีเมล', value: emailNotif, set: setEmailNotif },
    { label: 'การแจ้งเตือนแบบ Push', value: pushNotif, set: setPushNotif },
    { label: 'แจ้งเตือนเมื่อมีคูปองใหม่', value: couponAlerts, set: setCouponAlerts },
    { label: 'แจ้งเตือนเมื่อคูปองใกล้หมดอายุ', value: expiryAlerts, set: setExpiryAlerts },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">ตั้งค่าการแจ้งเตือน</h1>
      <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
        <div className="space-y-4">
          {toggles.map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{t.label}</span>
              <button onClick={() => t.set(!t.value)} className={`relative h-6 w-11 rounded-full transition ${t.value ? 'bg-[#f72585]' : 'bg-[#30354a]'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${t.value ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => showToast('บันทึกการตั้งค่าแล้ว', 'success')} className="mt-5 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-5 py-2.5 text-sm font-semibold">บันทึกการตั้งค่า</button>
      </div>
    </div>
  );
}
