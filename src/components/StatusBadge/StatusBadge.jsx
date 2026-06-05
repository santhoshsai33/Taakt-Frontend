const StatusBadge = ({ status = '' }) => {
    const displayStatus = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

    const getStatusClass = (status) => {
        switch (status.replace(/_/g, ' ').toLowerCase()) {
            case 'dispatched': return 'badge-dispatched';
            case 'dispatch': return 'badge-dispatched';
            case 'booked': return 'badge-dispatched';
            case 'ready to dispatch': return 'badge-dispatched';
            case 'in transit': return 'badge-in-transit';
            case 'delivered': return 'badge-delivered';
            case 'delayed': return 'badge-busy';
            case 'busy': return 'badge-busy';
            case 'available': return 'badge-available';
            case 'on leave': return 'badge-on-leave';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <span className={`badge-soft ${getStatusClass(status)}`}>
            {displayStatus}
        </span>
    );
};

export default StatusBadge;
