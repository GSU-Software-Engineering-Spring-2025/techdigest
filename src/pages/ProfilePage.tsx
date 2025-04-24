import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import supabase from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          // Only redirect if we've confirmed the user isn't authenticated
          setIsLoading(false);
          navigate("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // Set form values from profile data
        if (profileData) {
          setName(profileData.full_name || "");
          setEmail(profileData.email || "");
        }

        // Set page title
        document.title = "My Profile - TechDigest";

        // Set loading to false after data is fetched
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Remove dependencies to ensure it only runs once on mount

  // Update form when user data changes (helpful after login)
  useEffect(() => {
    if (user) {
      setName(user.name || name);
      setEmail(user.email || email);
    }
  }, [user]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.error("You must be logged in to update your email");
        return;
      }

      if (email !== user.email) {
        const { data, error } = await supabase.auth.admin.updateUserById(
          user.id,
          { email: email }
        );

        if (error) throw error;
        toast.success("Email updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating profile: " + error);
    }
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.error("You must be logged in to update your name");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.error("You must be logged in to change your password");
        return;
      }

      if (passConfirm !== password) {
        toast.error("Passwords do not match");
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPass,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: passConfirm,
      });

      if (updateError) {
        toast.error("Failed to update password: " + updateError.message);
      } else {
        toast.success("Password successfully updated");
        // Clear the password fields
        setCurrentPass("");
        setPassword("");
        setPassConfirm("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-purple mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-tech-dark-gray">My Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your account information and preferences
        </p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleNameUpdate}>
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" className="px-4 py-2 h-10">
                        Update Name
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              <form onSubmit={handleEmailUpdate}>
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="flex-1"
                      />
                      <Button type="submit" className="px-4 py-2 h-10">
                        Update Email
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                    type="password"
                  />
                </div>
                <Button className="px-4 py-2" type="submit">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage your notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-tech-purple">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Feature coming soon</AlertTitle>
                <AlertDescription>
                  We're still working on implementing notification preferences.
                  Check back soon!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
