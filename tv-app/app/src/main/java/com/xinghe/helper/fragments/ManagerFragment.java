package com.xinghe.helper.fragments;

import android.app.Fragment;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.xinghe.helper.R;

import java.util.List;

public class ManagerFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_manager, container, false);

        TextView tvAppCount = view.findViewById(R.id.tvAppCount);
        TextView tvStorageUsed = view.findViewById(R.id.tvStorageUsed);
        LinearLayout appListContainer = view.findViewById(R.id.appListContainer);

        PackageManager pm = getActivity().getPackageManager();
        List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        tvAppCount.setText(apps.size() + "");

        int storageUsed = 0;
        for (ApplicationInfo app : apps) {
            if ((app.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                View appItem = inflater.inflate(R.layout.item_app, appListContainer, false);
                TextView tvAppName = appItem.findViewById(R.id.tvAppName);
                TextView tvAppSize = appItem.findViewById(R.id.tvAppSize);

                tvAppName.setText(app.loadLabel(pm).toString());
                tvAppSize.setText(getAppSize(app));

                appListContainer.addView(appItem);
                storageUsed += 1;
            }
        }

        tvStorageUsed.setText(storageUsed + "MB");

        return view;
    }

    private String getAppSize(ApplicationInfo app) {
        return "15MB";
    }
}
