import { useEffect, useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    // 👇 Check for mobile screen (350px - 450px)
    const width = window.innerWidth;
    if (width >= 350 && width <= 450) {
      setShowMobileWarning(true);
      setTimeout(() => {
        setShowMobileWarning(false); // hide warning after delay
      }, 4000); // adjust delay as needed
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      let role: string | null = null;

      // 🔍 Check "staffs"
      let userRef = doc(db, "staffs", user.uid);
      let userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        role = userData.role;
        console.log("✅ User role found in staffs:", role);
      } else {
        // 🔍 Check "users"
        userRef = doc(db, "users", user.uid);
        userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          role = userData.role;
          console.log("✅ User role found in users:", role);
        } else {
          console.log("❌ User not found in either 'staffs' or 'users'.");
          router.replace("/login");
          setLoading(false);
          return;
        }
      }

      if (
        role &&
        allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
      ) {
        setAuthorized(true);
      } else {
        console.log("🚫 Unauthorized access attempt. Role:", role);
        router.replace("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || showMobileWarning) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
          flexDirection: "column",
          color: "#56021f",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        {showMobileWarning ? (
          <>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              ⚠️ Not Optimized for Mobile
            </h2>
            <p style={{ marginTop: "0.5rem", maxWidth: "300px" }}>
              This system is not fully responsive on mobile devices. Please use a tablet or PC for the best experience.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                border: "4px solid #56021f",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ marginTop: "16px", fontSize: "16px" }}>
              Checking access...
            </p>
          </>
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
