import ChartBar from "../../components/admin/ChartBar.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminAnalyticsPage = () => {
  const { analytics } = useAdmin();
  const responseMinutes = Math.round(Number(analytics?.responseTime?.avg_response_minutes || 0));
  const totalRequests = Number(analytics?.deliveryRate?.total_requests || 0);
  const deliveredRequests = Number(analytics?.deliveryRate?.delivered_requests || 0);
  const successRate = totalRequests ? Math.round((deliveredRequests / totalRequests) * 100) : 0;

  return (
    <DashboardLayout>
      <StatCard label="Total Requests" value={analytics?.summary?.total_requests || 0} />
      <StatCard
        label="Completed Deliveries"
        value={analytics?.summary?.delivered_requests || 0}
        accent="green"
      />
      <StatCard label="Avg Response" value={`${responseMinutes || 0} min`} accent="amber" />
      <StatCard label="Success Rate" value={`${successRate}%`} />
      <section className="panel span-2">
        <div className="panel-header">
          <h3>Requests by Urgency</h3>
        </div>
        <ChartBar data={analytics?.urgencyBreakdown || []} />
      </section>
      <section className="panel">
        <div className="panel-header">
          <h3>Recent Activity</h3>
        </div>
        <div className="timeline">
          {(analytics?.recentActivity || []).map((item) => (
            <div key={item.id} className="timeline-item">
              <strong>{item.action_type}</strong>
              <span>
                {item.actor_name || "System"} - {item.status} -{" "}
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
