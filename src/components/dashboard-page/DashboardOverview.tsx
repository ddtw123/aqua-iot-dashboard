"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Fish, Globe, MapPin, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from '@/hooks/use-toast';

export default function DashboardOverview({ deviceId }: { deviceId: string}) {
  const [speciesData, setSpeciesData] = useState<{
    device_id: string;
    species: string;
    city: string;
    lat: number;
    lng: number;
  }>({
    device_id: deviceId,
    species: "",
    city: "",
    lat: 0,
    lng: 0,
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<string>("");
  const [formData, setFormData] = useState({
    species: "",
    city: "",
    lat: "",
    lng: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/species-map?device_id=${deviceId}`);
        const result = await response.json();
        const first = Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : undefined;
        if (first) {
          setSpeciesData(first);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [deviceId]);

  const handleEditClick = (field: string) => {
    setEditingField(field);
    setFormData({
      species: speciesData.species,
      city: speciesData.city,
      lat: speciesData.lat.toString(),
      lng: speciesData.lng.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        device_id: deviceId,
        species: formData.species,
        city: formData.city,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
      };

      const response = await fetch("/api/species-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setSpeciesData(updatedData);
        setIsDialogOpen(false);
        toast({
          title: t('threshold.saveSuccessTitle'),
          description: t('threshold.saved')
        });
      } else {
        toast({
          title: t('threshold.saveErrorTitle'),
          description: t('threshold.saveError'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('threshold.saveErrorTitle'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const cards = [
    {
      title: t("homepage.species"),
      value: speciesData.species || t("homepage.notSet"),
      icon: Fish,
      field: "species",
      color: "text-blue-600",
    },
    {
      title: t("homepage.city"),
      value: speciesData.city || t("homepage.notSet"),
      icon: MapPin,
      field: "city",
      color: "text-green-600",
    },
    {
      title: t("homepage.latitude"),
      value: speciesData.lat ? speciesData.lat.toFixed(6) : t("homepage.notSet"),
      icon: Globe,
      field: "lat",
      color: "text-purple-600",
    },
    {
      title: t("homepage.longitude"),
      value: speciesData.lng ? speciesData.lng.toFixed(6) : t("homepage.notSet"),
      icon: Globe,
      field: "lng",
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4 text-center">Loading data...</div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="font-roboto text-left text-h5SM md:text-h3MD lg:text-h3LG mb-4 text-black dark:text-white duration-300">
        {t("homepage.dashboardOverview")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.field} className="relative bg-white dark:bg-dark_blue border-slate-200 dark:border-border_blue duration-300 rounded-none">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-h5SM md:text-h4MD text-black dark:text-white duration-300">
                    {card.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditClick(card.field)}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${card.color}`} />
                  <span className="text-h4SM md:text-h3SM text-black dark:text-white duration-300">
                    {card.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="species" className="text-right text-sm font-medium">
                {t("homepage.species")}
              </label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="col-span-3"
                placeholder="Enter fish species"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="city" className="text-right text-sm font-medium">
                {t("homepage.city")}
              </label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="col-span-3"
                placeholder="Enter city name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lat" className="text-right text-sm font-medium">
                {t("homepage.latitude")}
              </label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="col-span-3"
                placeholder="Enter latitude"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lng" className="text-right text-sm font-medium">
                {t("homepage.longitude")}
              </label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="col-span-3"
                placeholder="Enter longitude"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button className="bg-black dark:bg-white hover:opacity-90 text-white dark:text-black duration-300" onClick={handleSave}>
              {t("common.saveChanges")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
