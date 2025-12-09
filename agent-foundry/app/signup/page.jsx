// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { HiOutlineSparkles, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
// import Notification from "@/components/Notification";

// export default function SignupPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     age: "",
//     gender: "",
//     height: "",
//     weight: "",
//     blood_group: "",
//     allergies: "",
//     medical_conditions: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validate required fields
//       if (!formData.name || !formData.email || !formData.password || 
//           !formData.age || !formData.gender || !formData.height || !formData.weight) {
//         throw new Error("Please fill all required fields");
//       }

//       // Call signup API
//       const response = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           age: parseInt(formData.age),
//           gender: formData.gender,
//           height: parseFloat(formData.height),
//           weight: parseFloat(formData.weight),
//           blood_group: formData.blood_group || null,
//           allergies: formData.allergies || null,
//           medical_conditions: formData.medical_conditions || null,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Signup failed");
//       }

//       // Show success notification
//       setNotification({
//         type: "success",
//         message: `Account created! Your Patient ID: ${data.patient_id}`,
//       });

//       // Redirect to login after 2 seconds
//       setTimeout(() => {
//         router.push("/login");
//       }, 2500);

//     } catch (error) {
//       console.error("Signup error:", error);
//       setNotification({
//         type: "error",
//         message: error.message || "Signup failed. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center px-4 py-8">
//       {/* Floating orbs */}
//       <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//         <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blurple-500/35 blur-3xl animate-float-slow" />
//         <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-indigoSoft/30 blur-3xl animate-float-slow" />
//       </div>

//       <div className="glass-panel glass-inner w-full max-w-2xl border-slate-50/20 bg-slate-950/80 p-8 shadow-glass-soft">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blurple-400 via-electricSoft to-violetDeep shadow-neon-glow">
//             <HiOutlineSparkles className="h-8 w-8 text-slate-50" />
//           </div>
//           <h1 className="text-2xl font-bold text-slate-50">Create Your Account</h1>
//           <p className="mt-2 text-sm text-slate-400">
//             Join HealthForUs - Your AI Medical Companion
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="John Doe"
//               className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="john@example.com"
//               className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//                 required
//                 minLength={6}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
//               >
//                 {showPassword ? (
//                   <HiOutlineEyeSlash className="h-5 w-5" />
//                 ) : (
//                   <HiOutlineEye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Age, Gender, Blood Group */}
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Age *
//               </label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 placeholder="25"
//                 min="1"
//                 max="120"
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//                 required
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Gender *
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50 focus:shadow-neon-glow"
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Blood Group
//               </label>
//               <select
//                 name="blood_group"
//                 value={formData.blood_group}
//                 onChange={handleChange}
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-electricSoft/50 focus:shadow-neon-glow"
//               >
//                 <option value="">Select</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
//             </div>
//           </div>

//           {/* Height and Weight */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Height (cm) *
//               </label>
//               <input
//                 type="number"
//                 name="height"
//                 value={formData.height}
//                 onChange={handleChange}
//                 placeholder="175"
//                 min="50"
//                 max="250"
//                 step="0.1"
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//                 required
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Weight (kg) *
//               </label>
//               <input
//                 type="number"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleChange}
//                 placeholder="70"
//                 min="20"
//                 max="300"
//                 step="0.1"
//                 className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-electricSoft/50 focus:shadow-neon-glow"
//                 required
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-neon w-full py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         {/* Login Link */}
//         <div className="mt-6 text-center text-sm text-slate-400">
//           Already have an account?{" "}
//           <button
//             onClick={() => router.push("/login")}
//             className="text-electricSoft transition-colors hover:text-blurple-400"
//           >
//             Login here
//           </button>
//         </div>
//       </div>

//       {/* Notification Toast */}
//       {notification && (
//         <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
//           <Notification
//             message={notification.message}
//             type={notification.type}
//             onClose={() => setNotification(null)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import Notification from "@/components/Notification";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    blood_group: "",
    allergies: "",
    medical_conditions: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.age ||
        !formData.gender ||
        !formData.height ||
        !formData.weight
      ) {
        throw new Error("Please fill all required fields");
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          blood_group: formData.blood_group || null,
          allergies: formData.allergies || null,
          medical_conditions: formData.medical_conditions || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setNotification({
        type: "success",
        message: `Account created! Your Patient ID: ${data.patient_id}`,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error) {
      console.error("Signup error:", error);
      setNotification({
        type: "error",
        message: error.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      {/* Background medical glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-medical-primary/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-medical-ai/25 blur-3xl" />
      </div>

      <div className="glass-panel-medical glass-inner w-full max-w-3xl border-medical-primary/25 bg-slate-950/80 px-6 py-7 sm:px-10 sm:py-8 rounded-3xl shadow-medical-glow">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-primary via-medical-ai to-medical-success shadow-medical-glow">
            <HiOutlineSparkles className="h-8 w-8 text-slate-50" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-medical-primary via-medical-ai to-medical-success bg-clip-text text-transparent">
            Create Your HealthForUs Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">
            One secure profile to power all your AI consultations, timelines, and
            medical records.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              At least 6 characters. Use a strong, unique password for medical data.
            </p>
          </div>

          {/* Age, Gender, Blood Group */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="1"
                max="120"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all focus:border-medical-primary/70 focus:shadow-medical-glow"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
                min="50"
                max="250"
                step="0.1"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                min="20"
                max="300"
                step="0.1"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
                required
              />
            </div>
          </div>

          {/* Optional medical details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Allergies (optional)
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows={3}
                placeholder="E.g. penicillin, peanuts, pollen"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-300">
                Existing Conditions (optional)
              </label>
              <textarea
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleChange}
                rows={3}
                placeholder="E.g. diabetes, hypertension, asthma"
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-medical-primary/70 focus:shadow-medical-glow"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-medical-primary w-full py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-medical-primary transition-colors hover:text-medical-ai"
          >
            Login here
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
