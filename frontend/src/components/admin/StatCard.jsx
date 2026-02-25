// src/components/admin/StatCard.jsx
const StatCard = ({
  icon: Icon,
  title,
  value,
  bgColor = "bg-soft-brown-100",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-soft-brown-200 hover:shadow-md transition-all hover:border-soft-brown-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className="w-6 h-6 text-soft-brown-700" />
        </div>
      </div>
      <p className="text-sm text-soft-brown-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-soft-brown-800">{value}</p>
    </div>
  );
};

export default StatCard;
