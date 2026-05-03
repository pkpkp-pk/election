import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import ImmersiveHome from "@/pages/ImmersiveHome";
import Registration from "@/pages/Registration";
import HowItWorks from "@/pages/HowItWorks";
import Timeline from "@/pages/Timeline";
import VotingDay from "@/pages/VotingDay";
import Types from "@/pages/Types";
import FAQ from "@/pages/FAQ";
import Glossary from "@/pages/Glossary";
import Candidates from "@/pages/Candidates";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Home is full-screen immersive — no Layout wrapper */}
      <Route path="/" component={ImmersiveHome} />

      {/* All other pages use the standard Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/registration" component={Registration} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/timeline" component={Timeline} />
            <Route path="/voting-day" component={VotingDay} />
            <Route path="/types" component={Types} />
            <Route path="/faq" component={FAQ} />
            <Route path="/glossary" component={Glossary} />
            <Route path="/candidates" component={Candidates} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
