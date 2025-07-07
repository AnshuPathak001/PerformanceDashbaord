export default function Header() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '10px 20px',
        height: '60px',
        borderBottom: '1px solid #ddd',
        background: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#888',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '18px',
            marginRight: '10px'
          }}>
            👤
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold' }}>Anshu Pathak</span>
            <span style={{ fontSize: '12px', color: '#555' }}>Software Engineer</span>
          </div>
        </div>
      </div>
    );
  }
  