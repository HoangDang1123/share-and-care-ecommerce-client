import { ReturnInfo } from "@/interface/order";
import { ReturnStatus } from "@/interface/return";
import { formatPrice, formatReason } from "@/utils/helpers";
import {
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ReturnStatusCardProps {
  returnStatus: ReturnInfo;
}

const statusStyles: Record<ReturnStatus, string> = {
  [ReturnStatus.PENDING]: "border-yellow-300 bg-yellow-50 text-yellow-700",
  [ReturnStatus.COMPLETED]: "border-green-300 bg-green-50 text-green-700",
  [ReturnStatus.APPROVED]: "border-green-300 bg-green-50 text-green-700",
  [ReturnStatus.FAILED]: "border-red-300 bg-red-50 text-red-700",
  [ReturnStatus.REJECTED]: "border-red-300 bg-red-50 text-red-700",
  [ReturnStatus.NOT_RETURNED]: "border-gray-300 bg-gray-50 text-gray-700",
};

export const ReturnStatusCard: React.FC<ReturnStatusCardProps> = ({ returnStatus }) => {
  const cardStatusClass = statusStyles[returnStatus.status] ?? "border-gray-300 bg-gray-50 text-gray-700";

  // Timeline items array for easier rendering
  const timelineItems = [
    {
      label: "Thời gian yêu cầu",
      date: returnStatus.requestedAt,
      icon: <ClockIcon className="w-6 h-6 text-blue-500" />,
      show: !!returnStatus.requestedAt,
    },
    {
      label: "Thời gian chấp nhận",
      date: returnStatus.approvedAt,
      icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
      show: !!returnStatus.approvedAt,
    },
    {
      label: "Thời gian từ chối",
      date: returnStatus.rejectedAt,
      icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
      show: !!returnStatus.rejectedAt,
    },
    {
      label: "Thời gian hoàn tất",
      date: returnStatus.completedAt,
      icon: <CheckCircleIcon className="w-6 h-6 text-green-700" />,
      show: !!returnStatus.completedAt,
    },
  ].filter(item => item.show);

  return (
    <div className={`w-full mx-auto bg-white border rounded-xl shadow-sm p-6 mt-4 ${cardStatusClass} border-2`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardDocumentIcon className="w-7 h-7" />
        <span className="text-xl font-semibold">Trạng thái yêu cầu hoàn trả</span>
      </div>

      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left: Info grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500">Số tiền</p>
              <p className="font-medium">{formatPrice(returnStatus.amount)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500">Lý do hoàn trả</p>
              <p className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                {formatReason(returnStatus.reason)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500">Xem xét thủ công</p>
              <p className="font-medium">{returnStatus.manualRequired ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Description full width */}
          <div className="flex items-center gap-3 md:col-span-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-gray-500">Mô tả</p>
              <p className="font-medium">{returnStatus.description || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="ml-6 border-l-2 border-gray-200 pl-6 space-y-6 text-sm text-gray-600">
          {timelineItems
            .filter(item => item.date)
            .map(({ label, date, icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div>{icon}</div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs text-gray-600">{new Date(date!).toLocaleString()}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
