import React, { useEffect, useState } from 'react';


type TeamMember = {
  userId: string;
  teamId: string;
  roleInTeam: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    language: string;
    company: string;
    isActive: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
  };
};

type Props = {
  teamId: string;
};

const TeamMembersList: React.FC<Props> = ({ teamId }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/get-members-by-team/${teamId}`);
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data: TeamMember[] = await response.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p>Error: {error}</p>;
  if (members.length === 0) return <p>No members found for this team.</p>;

  return (
    <div>
      <h2>Team Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.userId} style={{ marginBottom: '1rem' }}>
            <strong>
              {member.user.name} {member.user.lastName}
            </strong>{' '}
            - <em>{member.roleInTeam}</em>
            <br />
            Email: {member.user.email}
            <br />
            Company: {member.user.company}
            <br />
            Status: {member.user.isActive ? 'Active' : 'Inactive'}, Available:{' '}
            {member.user.isAvailable ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembersList;
