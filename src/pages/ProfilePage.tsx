
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  useEffect(() => {
    // TODO: Fetch user profile data from API
    document.title = "My Profile - TechDigest";
    
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isAuthenticated, navigate, user]);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update user profile data via API
    alert("Profile updated successfully!");
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Change password via API
    alert("Password updated successfully!");
  };
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
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
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-tech-purple">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Feature coming soon</AlertTitle>
                <AlertDescription>
                  We're still working on implementing notification preferences. Check back soon!
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
